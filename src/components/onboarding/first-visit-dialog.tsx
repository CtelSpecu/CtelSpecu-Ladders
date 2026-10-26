import { WelcomeIllustration } from '@/components/illustrations/welcome-illustration'
import { useOnboarding } from '@/components/onboarding/onboarding-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function FirstVisitDialog() {
  const { dialogOpen, choose, dismissDialog } = useOnboarding()

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) dismissDialog()
      }}
    >
      <DialogContent className="max-w-md overflow-hidden p-0" showCloseButton>
        <WelcomeIllustration className="w-full" />

        <div className="px-6 pb-6">
          <DialogHeader>
            <DialogTitle className="text-lg">先确认一下你的情况</DialogTitle>
            <DialogDescription>
              我们会按你的选择调整推荐内容，随时可以在顶部「更多 → 新手引导」重新开始。
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex flex-col gap-2">
            <Button variant="outline" onClick={() => choose('veteran')} className="w-full">
              我不是新手，直接开始
            </Button>
            <Button onClick={() => choose('newbie')} className="w-full">
              我是新手，带我配置
            </Button>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            仅在本机记录选择，不上传。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
