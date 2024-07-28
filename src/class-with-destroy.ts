import { IDestroyController } from './destroy-controller'

export abstract class ClassWithDestroy {
    constructor(controller: IDestroyController) {
        controller.onDestroy(() => {
            // @ts-ignore
            if (process.env.NODE_ENV === 'development') {
                console.log('destroy class:', this.constructor.name)
            }
            this.destroy()
        })
    }
    abstract destroy(): void
}
