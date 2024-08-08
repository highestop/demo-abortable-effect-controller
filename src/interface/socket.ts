import { AbortableEffectController } from '../core/abortable-effect-controller'

export function createSocket(
    configs: {
        url: string | URL
        protocols?: string | string[]
    },
    controller: AbortableEffectController
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
