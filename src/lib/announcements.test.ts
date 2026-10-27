import { describe, expect, it } from 'vitest'

import { endOfToday, isVisible, toastDuration, type Announcement } from './announcements'

const NOW = Date.parse('2026-10-27T12:00:00+08:00')
const HOUR = 3_600_000
const DAY = 86_400_000

const base: Announcement = {
  id: 'demo',
  order: 1,
  title: '标题',
  content: '正文',
  publishedAt: '2026-10-26T00:00:00+08:00',
  expiresAt: null,
  frequency: { type: 'always' },
  duration: { type: 'seconds', value: 20 },
}

function make(patch: Partial<Announcement>): Announcement {
  return { ...base, ...patch }
}

describe('isVisible', () => {
  it('未到发布时间不显示', () => {
    expect(isVisible(make({ publishedAt: '2026-10-28T00:00:00+08:00' }), undefined, NOW)).toBe(false)
  })

  it('过期后不显示', () => {
    expect(isVisible(make({ expiresAt: '2026-10-27T00:00:00+08:00' }), undefined, NOW)).toBe(false)
  })

  it('永久公告不会因时间被排除', () => {
    expect(isVisible(make({ expiresAt: null }), undefined, NOW)).toBe(true)
  })

  it('closed 永久关闭', () => {
    expect(isVisible(base, { closed: true }, NOW)).toBe(false)
  })

  it('hiddenUntil 未到期不显示，过期后恢复', () => {
    expect(isVisible(base, { hiddenUntil: NOW + HOUR }, NOW)).toBe(false)
    expect(isVisible(base, { hiddenUntil: NOW - 1 }, NOW)).toBe(true)
  })

  it('daily：同一天只显示一次', () => {
    const daily = make({ frequency: { type: 'daily' } })
    expect(isVisible(daily, { lastShownAt: NOW - HOUR }, NOW)).toBe(false)
    expect(isVisible(daily, { lastShownAt: NOW - DAY }, NOW)).toBe(true)
  })

  it('interval：按间隔限制', () => {
    const interval = make({ frequency: { type: 'interval', value: 1, unit: 'day' } })
    expect(isVisible(interval, { lastShownAt: NOW - 12 * HOUR }, NOW)).toBe(false)
    expect(isVisible(interval, { lastShownAt: NOW - 25 * HOUR }, NOW)).toBe(true)
  })

  it('until：超过指定时间不再显示', () => {
    expect(
      isVisible(make({ frequency: { type: 'until', at: '2026-10-27T11:00:00+08:00' } }), undefined, NOW),
    ).toBe(false)
    expect(
      isVisible(make({ frequency: { type: 'until', at: '2026-10-27T13:00:00+08:00' } }), undefined, NOW),
    ).toBe(true)
  })

  it('duration：只在发布后一段时间内显示', () => {
    const limited = make({
      publishedAt: '2026-10-25T12:00:00+08:00',
      frequency: { type: 'duration', value: 1, unit: 'day' },
    })
    expect(isVisible(limited, undefined, NOW)).toBe(false)
    expect(
      isVisible(make({ frequency: { type: 'duration', value: 7, unit: 'day' } }), undefined, NOW),
    ).toBe(true)
  })

  it('always 仍受关闭与免打扰约束', () => {
    expect(isVisible(base, undefined, NOW)).toBe(true)
    expect(isVisible(base, { closed: true }, NOW)).toBe(false)
    expect(isVisible(base, { hiddenUntil: NOW + DAY }, NOW)).toBe(false)
  })
})

describe('toastDuration', () => {
  it('sticky 返回 Infinity', () => {
    expect(toastDuration({ type: 'sticky' })).toBe(Number.POSITIVE_INFINITY)
  })

  it('按单位换算成毫秒', () => {
    expect(toastDuration({ type: 'seconds', value: 20 })).toBe(20_000)
    expect(toastDuration({ type: 'minutes', value: 2 })).toBe(120_000)
    expect(toastDuration({ type: 'hours', value: 1 })).toBe(3_600_000)
  })
})

describe('endOfToday', () => {
  it('落在当天 23:59:59.999', () => {
    const end = new Date(endOfToday(NOW))
    expect(end.getDate()).toBe(new Date(NOW).getDate())
    expect(end.getHours()).toBe(23)
    expect(end.getMinutes()).toBe(59)
    expect(end.getSeconds()).toBe(59)
    expect(end.getMilliseconds()).toBe(999)
  })
})
