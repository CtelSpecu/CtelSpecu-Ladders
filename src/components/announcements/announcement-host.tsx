import { useEffect, useRef } from 'react'
import { Megaphone } from 'lucide-react'
import { toast } from 'sonner'

import { useOnboarding } from '@/components/onboarding/onboarding-provider'
import { SplitButton } from '@/components/ui/split-button'
import {
  closeForGood,
  eligibleAnnouncements,
  markShown,
  snoozeToday,
  snoozeWeek,
  toastDuration,
  type Announcement,
} from '@/lib/announcements'
import { renderInlineMarkdown } from '@/lib/inline-markdown'

type DismissAction = 'today' | 'week' | 'never'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function AnnouncementCard({
  announcement,
  onAction,
}: {
  announcement: Announcement
  onAction: (action: DismissAction) => void
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-[var(--shadow-lift)]">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Megaphone className="size-3.5 text-primary" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug font-semibold">{announcement.title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {renderInlineMarkdown(announcement.content)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {dateFormatter.format(new Date(announcement.publishedAt))}
        </span>
        <SplitButton
          label="今天不提示"
          onClick={() => onAction('today')}
          menuLabel="更多免打扰选项"
          actions={[
            { label: '七天内不提示', onSelect: () => onAction('week') },
            { label: '关闭此公告', onSelect: () => onAction('never'), destructive: true },
          ]}
        />
      </div>
    </div>
  )
}

/**
 * 公告队列：等首访弹窗关闭后再开始，按 order 一条一条弹；
 * 关掉或显示完一条才弹下一条。
 */
export function AnnouncementHost() {
  const { dialogOpen } = useOnboarding()
  const started = useRef(false)

  useEffect(() => {
    if (dialogOpen || started.current) return
    started.current = true

    const queue = eligibleAnnouncements()
    let index = 0

    const showNext = () => {
      if (index >= queue.length) return
      const item = queue[index]
      index += 1
      markShown(item.id)

      // sonner 的自动关闭只触发 onAutoClose，手动关闭才触发 onDismiss；
      // 两个都接上，并用 advanced 防止同一张被推进两次。
      let advanced = false
      const advance = () => {
        if (advanced) return
        advanced = true
        showNext()
      }

      toast.custom(
        (id) => (
          <AnnouncementCard
            announcement={item}
            onAction={(action) => {
              if (action === 'today') snoozeToday(item.id)
              if (action === 'week') snoozeWeek(item.id)
              if (action === 'never') closeForGood(item.id)
              toast.dismiss(id)
            }}
          />
        ),
        {
          id: `announcement-${item.id}`,
          duration: toastDuration(item.duration),
          onDismiss: advance,
          onAutoClose: advance,
        },
      )
    }

    showNext()
  }, [dialogOpen])

  return null
}
