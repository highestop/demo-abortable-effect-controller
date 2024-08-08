import { AbortableEffectController } from './abortable-effect-controller'

export abstract class ClassWithController {
    protected controller: AbortableEffectController
    constructor(controller: AbortableEffectController) {
        this.controller = controller

        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `Create Service (${this.constructor.name}) in Controller (${this.controller.id})`
            )
        }

        // 在 service 创建时，注入 service 的销毁函数
        this.controller.onCleanup((reason) => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(
                    `Destroy Service (${this.constructor.name}) in Controller (${this.controller.id})`
                )
            }

            this.destroy(reason)
        })
    }

    // 在子类中实现销毁逻辑
    abstract destroy(reason?: string): void
}
