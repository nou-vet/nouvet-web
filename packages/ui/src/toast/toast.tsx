import { createSingletonRoot } from "@solid-primitives/rootless";
import {
	type Accessor,
	type ComponentProps,
	For,
	type JSX,
	type ResolvedChildren,
	children,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	getOwner,
	onCleanup,
	runWithOwner,
	splitProps,
} from "solid-js";
import { Card } from "../card";
import { composeEventHandlers, startViewTransition } from "../utils";

import { tw } from "../tw";
import css from "./toast.module.css";
/**
 * TODO:
 * - reset timer when mouse is over the group of toasts
 * - move back older notifications behind the new one
 * - show all notifications as list when the pointer is over
 */

interface ToastProps extends ComponentProps<typeof Card<"li">> {
	style?: JSX.CSSProperties;
}

const Toast = (ownProps: ToastProps) => {
	const [local, props] = splitProps(ownProps, ["id", "style", "as"]);
	const localId = createUniqueId();
	const id = () => local.id || localId;
	return (
		<Card
			as="li"
			aria-atomic="true"
			role="status"
			tabIndex={0}
			{...props}
			class={tw(
				css.toast,
				"allow-discrete isolate border border-on-background/5 shadow-popover transition-all duration-300",
				props.class,
			)}
			style={{
				...local.style,
				"view-transition-name": `nou-toast-${id()}`,
			}}
			id={id()}
			onClick={composeEventHandlers(props.onClick, (e) => {
				console.log(id());
				(e.currentTarget as HTMLElement).dispatchEvent(new ToastDismissEvent(id()));
			})}
		>
			{props.children}
		</Card>
	);
};

const useToastsController = createSingletonRoot(() => {
	const [items, setItems] = createSignal<Array<Accessor<ResolvedChildren>>>([]);

	return {
		items,
		add: (el: Accessor<ResolvedChildren>) =>
			startViewTransition(() => {
				setItems((rendered) => [el, ...rendered]);
			}),
		removeById: (elementId: string) =>
			startViewTransition(() => {
				setItems((rendered) => {
					const toRemoveIndex = rendered.findIndex((el) => {
						const element = el();
						return element instanceof HTMLElement && element.id === elementId;
					});
					console.log({ toRemoveIndex });
					if (toRemoveIndex === -1) return rendered;
					const el = rendered[toRemoveIndex]?.();
					if (!(el instanceof HTMLElement)) return rendered;
					return rendered.toSpliced(toRemoveIndex, 1);
				});
			}),
		remove: (toRemove: ResolvedChildren) =>
			startViewTransition(() => {
				setItems((rendered) => {
					const toRemoveIndex = rendered.findIndex((el) => {
						const element = el();
						return element instanceof HTMLElement && element === toRemove;
					});
					console.log({ toRemoveIndex });
					if (toRemoveIndex === -1) return rendered;
					const el = rendered[toRemoveIndex]?.();
					if (!(el instanceof HTMLElement)) return rendered;
					el.style["view-transition-name"] = "nou-toast-removed";
					return rendered.toSpliced(toRemoveIndex, 1);
				});
			}),
	};
});
function Toaster(props: { label: string }) {
	const toaster = useToastsController();
	const [ref, setRef] = createSignal<HTMLElement | null>(null);
	const hasToasts = createMemo(() => toaster.items().length > 0);
	const [expanded, setExpanded] = createSignal(false);
	const [pointerDown, setPointerDown] = createSignal(false);

	createEffect(() => {
		const root = ref();
		if (!root) return;
		if (hasToasts()) {
			root.showPopover();
		} else {
			root.hidePopover();
		}
	});

	createEffect(() => {
		document.addEventListener("pointerdown", (e) => {
			if (e.target instanceof Node && ref()?.contains(e.target)) {
				startViewTransition(() => {
					setPointerDown(true);
				});
			}
		});
		document.addEventListener("pointerup", (e) => {
			if (e.target instanceof Node && !ref()?.contains(e.target)) {
				startViewTransition(() => {
					setPointerDown(false);
				});
			}
		});
	});

	return (
		<div
			// Popover is used to ensure that if notification is triggered from a dialog or any
			// top layer element, the toast appears on top of it
			popover="manual"
			id="nou-ui-toaster"
			class="fixed top-12 mx-auto my-0 overflow-visible bg-transparent p-0"
			role="region"
			aria-label={props.label}
			ref={setRef}
		>
			<ol
				class={tw(
					css.list,
					"-m-4 items-center gap-2 p-4 empty:hidden",
					expanded() || pointerDown() ? css.expanded : undefined,
				)}
				tabIndex={-1}
				on:toast-dismiss={(e) => toaster.remove(e.currentTarget)}
				onPointerEnter={() => {
					startViewTransition(() => {
						setExpanded(true);
					});
				}}
				onPointerLeave={() => {
					startViewTransition(() => {
						setExpanded(false);
					});
				}}
			>
				<For each={toaster.items()}>{(el) => el()}</For>
			</ol>
		</div>
	);
}

function useToaster() {
	const toaster = useToastsController();
	const owner = getOwner();
	return (element: () => JSX.Element) =>
		runWithOwner(owner, () => {
			const child = children(element);
			function cleanup() {
				toaster.remove(child());
			}
			toaster.add(child);
			onCleanup(cleanup);
			return cleanup;
		});
}

export { useToaster, Toast, Toaster };

class ToastDismissEvent extends CustomEvent<{ id: string }> {
	constructor(id: string) {
		super("toast-dismiss", { bubbles: true, detail: { id } });
	}
}

declare module "solid-js" {
	namespace JSX {
		interface CustomEvents {
			"toast-dismiss": ToastDismissEvent;
		}
		interface CustomCaptureEvents {
			"toast-dismiss": ToastDismissEvent;
		}
	}
}
