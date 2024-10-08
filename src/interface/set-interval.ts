import { TracableAbortController } from '../impl'

export function setIntervalWithController(
    callback: () => void,
    interval: number,
    controller: TracableAbortController
): void {
    const stv = setInterval(callback, interval)
    controller.onCleanup(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Interval is aborted in Controller (${controller.id}).`)
        }

        clearInterval(stv)
    })
}
