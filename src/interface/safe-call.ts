import { AbortableEffectController } from '../core/abortable-effect-controller'

export function safeCall(call: () => void, controller: AbortableEffectController, callId?: string) {
    if (controller.abortSignal.aborted) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `${callId ?? 'SafeCall'} is aborted in Controller (${controller.id}).`
            )
        }
        return
    }
    call()
}
