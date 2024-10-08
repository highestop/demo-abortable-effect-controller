import { TracableAbortController } from '../impl'

export function setTimeoutWithController(
    callback: () => void,
    timeout: number,
    controller: TracableAbortController
): void {
    const sto = setTimeout(callback, timeout)
    controller.onCleanup(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Timeout is aborted in Controller (${controller.id}).`)
        }

        clearTimeout(sto)
    })
}
