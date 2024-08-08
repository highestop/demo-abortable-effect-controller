# demo-async-controller

## 背景

一个串连起来的异步链路可能需要提前被终止，但通常的异步任务不容易被终止，这导致无论是用户操作还是测试结束导致异步流程中断后，一些异步任务还在游离地被执行着，从而产生预期之外的行为。

异步任务的产物或执行过程中的副作用也需要被清理，这些清理工作目前很难被收集且及时执行，导致一些异步流程结束（ 中断或完成 ）之后的再重新执行一遍，就会产生不符合预期的运行结果。

## 目标

- 所有的状态和异步任务都有明确的 context 或 scope，需要伴随其生命周期创建和销毁。
- 在销毁时，所有的异步任务都可以被中断。
- 中断之后停止后面的代码执行，不再继续创建后续异步任务。
- 中断之后立即清理整个异步任务中已经产生的副作用，类似执行到一半的过程回退。
- 无论异步任务是中断还是完成，无论是异步还是同步，一个 context 可以收集到其生命周期下的所有清理工作，并在销毁后自动清理。

## 思路

- 提供支持 abort 能力的 async task，包装异步任务。
- 提供支持 abort 和收集 cleanup 的 controller，用户描述 context 的生命周期。
- 任何 async function 和 service 支持接入 controller 进而支持 abort 和 cleanup。
- 任何底层的异步对象都可以 wrap with controller 进而支持 abort 和 cleanup。

## 设计

- Task: 一个执行任务，包含同步或异步。
- AsyncTask: 一个异步任务，包含微任务 Promise、宏任务 Timeout/Interval、AnimationFrame、IdleCallback 等。
- Context / EffectContext: 一个任务执行的上下文容器。容器中可能包含若干同步或异步任务，容器的创建或销毁，会影响其中所有任务的执行和副作用清理。
- Controller / EffectController / AbortableEffectController: 一个生命周期控制器，控制一个 Context 的创建、中断、销毁和清理。
- Cleanup / CleanupEffect: 控制器的清理。会清理控制器控制的 Context 下的所有副作用，无论包含的异步是否处理完，只处理执行清理时已经收集到的清理工作。
- Abort: 控制器的中断。一般只对异步任务有意义，同步任务执行中不可能插入中断操作。
- Destroy: 控制器的销毁。会伴随中断和清理。

> Context 容器可以类比 React 中的 Context 或 Angular 中的 Module，它们在 UI 框架中也有生命周期的概念，如 React useEffect 的 setup cleanup 和 Angular 中的 onInit onDestroy。我们要做的其实是把需要严格控制的一系列代码任务剥离 Render 框架，因此 Context 的含义也发生了变化，它不一定是指一些组件的外层容器，而是持有着一些状态、管理着一些任务的一个流程，这个流程可以随时被事件终止或回退。创建、流转、终止、完成、回退，这些是容器的生命周期。
