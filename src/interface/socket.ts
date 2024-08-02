import { EffectController } from '../core/effect-controller'

export function createSocket(
    id: string,
    configs: {
        url: string | URL
        protocols?: string | string[]
    },
    parentController: EffectController
): [WebSocket, EffectController] {
    const controller = parentController.createChildController(id)
    const socket = new WebSocket(configs.url, configs.protocols)
    controller.onCleanup(() => {
        socket.close()
    })
    return [socket, controller]
}
