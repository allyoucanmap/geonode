// Important: Update this list on a React upgrade.
import _react from 'react'
import _reactDom from 'react-dom'
import _reactDomClient from 'react-dom/client'
import _jsxRuntime from 'react/jsx-runtime'

export const {
  Activity,
  Children,
  Component,
  Fragment,
  Profiler,
  PureComponent,
  StrictMode,
  Suspense,
  act,
  cache,
  cacheSignal,
  captureOwnerStack,
  cloneElement,
  createContext,
  createElement,
  createRef,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  unstable_useCacheRefresh,
  use,
  useActionState,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  version,
} = _react

export const {
  createPortal,
  flushSync,
  preconnect,
  prefetchDNS,
  preinit,
  preinitModule,
  preload,
  preloadModule,
  requestFormReset,
  unstable_batchedUpdates,
  useFormState,
  useFormStatus,
} = _reactDom

export const { createRoot, hydrateRoot } = _reactDomClient
export const { jsx, jsxs } = _jsxRuntime

// React internals kept for parity with real `react`/`react-dom`
export const { __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, __COMPILER_RUNTIME } = _react
export const { __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE } = _reactDom

export default _react
