export class AsyncTaskController {
    private static enabled = false
    static get isEnabled() {
        return AsyncTaskController.enabled
    }
    static assertEnabled(description?: string) {
        if (!AsyncTaskController.enabled) {
            throw new Error(
                [
                    'AsyncTaskController is disabled, cannot create any AsyncTask right now',
                    description && `(${description})`,
                ].join(' ')
            )
        }
        return true
    }
    static enable() {
        AsyncTaskController.enabled = true
    }
    static disable() {
        AsyncTaskController.enabled = false
    }
}
