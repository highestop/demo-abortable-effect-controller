import { TracableAbortController } from '../impl'

export function safeCall(
    call: () => void,
    controller: TracableAbortController,
    callId?: string
) {
    if (controller.destroyed) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `${callId ?? 'SafeCall'} is aborted in Controller (${
                    controller.id
                }).`
            )
        }
        return
    }
    call()
}
