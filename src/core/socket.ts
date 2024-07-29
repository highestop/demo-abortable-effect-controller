import { IEffectCleanupController } from "./effect-cleanup-controller";

/**
 * Create a new WebSocket with cleanup.
 * @param configs 
 * @param controller 
 * @returns 
 */
export function createSocket(configs: {
    url: string | URL,
    protocols?: string | string[]
}, controller: IEffectCleanupController) {
    const socket = new WebSocket(configs.url, configs.protocols)

    // cleanup the socket when the controller is destroyed
    controller.onCleanup(() => {
        socket.close()
    })

    // return the socket
    return socket
}