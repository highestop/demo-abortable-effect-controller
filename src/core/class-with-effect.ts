import { EffectController } from './effect-controller'
import { devLog, isDev } from './util'

export abstract class ClassWithEffect {
    protected controller: EffectController
    constructor(controller: EffectController = new EffectController()) {
        devLog(
            '[create class with effect]',
            this.constructor.name,
            controller.name
        )
        controller.onDestroy(() => {
            devLog(
                '[destroy class with effect]',
                this.constructor.name,
                controller.name
            )
            this.onDestroyed()
        })
    }
    abstract onDestroyed(): void
}
