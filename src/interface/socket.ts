import { TracableAbortController } from '../impl'

export function createSocket(
    configs: {
        url: string | URL
        protocols?: string | string[]
    },
    controller: TracableAbortController
): WebSocket {
    const socket = new WebSocket(configs.url, configs.protocols)

    controller.onCleanup(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `WebSocket is closing in Controller (${controller.id}).`
            )
        }

        socket.close()
    })

    return socket
}
