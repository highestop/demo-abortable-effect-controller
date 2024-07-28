import { IEffectController } from './effect-controller'

export abstract class BaseClassWithEffect {
    constructor(controller: IEffectController) {
        controller.onCleanup(() => {
            // @ts-ignore
            if (process.env.NODE_ENV === 'development') {
                console.log('destroy class:', this.constructor.name)
            }
            this.destroy()
        })
    }
    abstract destroy(): void
}
