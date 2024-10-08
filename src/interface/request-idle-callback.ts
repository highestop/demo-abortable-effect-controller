import { TracableAbortController } from '../impl'

export function requestIdleCallbackWithController(
    callback: () => void,
    controller: TracableAbortController
): void {
    const ric = requestIdleCallback(callback)
    controller.onCleanup(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `IdleCallback is aborted in Controller (${controller.id}).`
            )
        }

        cancelIdleCallback(ric)
    })
}
