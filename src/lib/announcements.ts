import { z } from 'zod'

import raw from '@/data/announcements.json'

const UNITS = ['hour', 'day', 'week', 'month'] as const
type Unit = (typeof UNITS)[number]

const UNIT_MS: Record<Unit, number> = {
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000,
  month: 2_592_000_000,
}

const frequencySchema = z.discriminatedUnion('type', [
  /** 总是显示：每次进站都弹（仍受「今天不提示 / 七天内不提示 / 关闭」约束） */
  z.object({ type: z.literal('always') }),
  /** 当日显示：同一天只弹一次 */
  z.object({ type: z.literal('daily') }),
  /** 按间隔显示：距上次弹出超过 N 小时/天/周/月才再弹 */
  z.object({ type: z.literal('interval'), value: z.number().positive(), unit: z.enum(UNITS) }),
  /** 显示到指定时间：过了这个时间点不再弹 */
  z.object({ type: z.literal('until'), at: z.iso.datetime({ offset: true }) }),
  /** 发布后 N 小时/天/周/月内显示 */
  z.object({ type: z.literal('duration'), value: z.number().positive(), unit: z.enum(UNITS) }),
])

const showDurationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('sticky') }),
  z.object({ type: z.literal('seconds'), value: z.number().positive() }),
  z.object({ type: z.literal('minutes'), value: z.number().positive() }),
  z.object({ type: z.literal('hours'), value: z.number().positive() }),
])

const announcementSchema = z.object({
  id: z.string().min(1),
  /** 展示顺序，小的先弹 */
  order: z.number().int(),
  title: z.string().min(1),
  /** 支持行内 Markdown：**加粗**、*斜体*、~~删除线~~、==高亮==、`代码` */
  content: z.string().min(1),
  publishedAt: z.iso.datetime({ offset: true }),
  /** null 表示永久有效 */
  expiresAt: z.iso.datetime({ offset: true }).nullable(),
  frequency: frequencySchema,
  duration: showDurationSchema,
})

export type Announcement = z.infer<typeof announcementSchema>
export type AnnouncementFrequency = Announcement['frequency']
export type AnnouncementDuration = Announcement['duration']

export const announcements: Announcement[] = z
  .array(announcementSchema)
  .parse(raw.announcements)
  .sort((a, b) => a.order - b.order)

const STORAGE_KEY = 'ctelspecu:announcements'

export interface AnnouncementState {
  /** 在这个时间点之前不再显示 */
  hiddenUntil?: number
  /** 关闭此公告：永久不再显示 */
  closed?: boolean
  /** 上次弹出的时间，用于 daily / interval 频率 */
  lastShownAt?: number
}

type StateMap = Record<string, AnnouncementState>

function readState(): StateMap {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY)
    if (!rawState) return {}
    const parsed: unknown = JSON.parse(rawState)
    return parsed && typeof parsed === 'object' ? (parsed as StateMap) : {}
  } catch {
    return {}
  }
}

function writeState(state: StateMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 隐私模式下存储不可用，忽略即可
  }
}

function update(id: string, patch: AnnouncementState) {
  const state = readState()
  state[id] = { ...state[id], ...patch }
  writeState(state)
}

/** 当天 23:59:59 的时间戳。 */
export function endOfToday(now = Date.now()) {
  const date = new Date(now)
  date.setHours(23, 59, 59, 999)
  return date.getTime()
}

export function toastDuration(duration: AnnouncementDuration) {
  switch (duration.type) {
    case 'sticky':
      return Number.POSITIVE_INFINITY
    case 'seconds':
      return duration.value * 1000
    case 'minutes':
      return duration.value * 60_000
    case 'hours':
      return duration.value * 3_600_000
  }
}

function sameDay(a: number, b: number) {
  const left = new Date(a)
  const right = new Date(b)
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

/** 是否还在发布期与有效期内。 */
export function isLive(item: Announcement, now: number) {
  const published = Date.parse(item.publishedAt)
  if (now < published) return false
  if (item.expiresAt && now > Date.parse(item.expiresAt)) return false
  return true
}

export function frequencyAllows(
  item: Announcement,
  now: number,
  entry: AnnouncementState | undefined,
) {
  const frequency = item.frequency
  switch (frequency.type) {
    case 'always':
      return true
    case 'daily':
      return !entry?.lastShownAt || !sameDay(entry.lastShownAt, now)
    case 'interval':
      return !entry?.lastShownAt || now - entry.lastShownAt >= frequency.value * UNIT_MS[frequency.unit]
    case 'until':
      return now <= Date.parse(frequency.at)
    case 'duration':
      return now <= Date.parse(item.publishedAt) + frequency.value * UNIT_MS[frequency.unit]
  }
}

/** 单条公告此刻是否应该显示（发布期 + 有效期 + 免打扰 + 频率）。 */
export function isVisible(
  item: Announcement,
  entry: AnnouncementState | undefined,
  now: number,
) {
  if (entry?.closed) return false
  if (entry?.hiddenUntil && now < entry.hiddenUntil) return false
  if (!isLive(item, now)) return false
  return frequencyAllows(item, now, entry)
}

/** 当前应该弹的公告，按 order 排好。 */
export function eligibleAnnouncements(now = Date.now()): Announcement[] {
  const state = readState()
  return announcements.filter((item) => isVisible(item, state[item.id], now))
}

/** 记录这次弹出，供 daily / interval 频率判断。 */
export function markShown(id: string, now = Date.now()) {
  update(id, { lastShownAt: now })
}

/** 今天不提示。 */
export function snoozeToday(id: string, now = Date.now()) {
  update(id, { hiddenUntil: endOfToday(now) })
}

/** 七天内不提示。 */
export function snoozeWeek(id: string, now = Date.now()) {
  update(id, { hiddenUntil: now + 7 * UNIT_MS.day })
}

/** 关闭此公告，永久不再显示。 */
export function closeForGood(id: string) {
  update(id, { closed: true })
}

/** 是否有已过期但仍留在 json 里的公告（提交前检查用）。 */
export function expiredAnnouncements(now = Date.now()) {
  return announcements.filter((item) => item.expiresAt && now > Date.parse(item.expiresAt))
}
