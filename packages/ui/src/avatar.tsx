import { Show } from "solid-js";

import { type VariantProps, tv, tw } from "./tw";

const avatarVariants = tv({
	base: "shrink-0 rounded-full shadow-inner",
	variants: {
		size: {
			base: "size-12",
			xs: "size-6",
			sm: "size-10",
			lg: "size-14",
			xl: "size-16",
			"2xl": "size-20",
		},
	},
	defaultVariants: {
		size: "base",
	},
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
	name: string;
	avatarUrl: string | null;
	class?: string;
}
function Avatar(props: AvatarProps) {
	return (
		<Show when={props.avatarUrl} fallback={<BoringAvatar {...props} />}>
			{(url) => (
				<img
					src={url()}
					alt={props.name}
					title={props.name}
					class={tw(avatarVariants({ size: props.size }), props.class)}
				/>
			)}
		</Show>
	);
}

export { Avatar };

/**
 * The implementation is copied from https://github.com/cmgriffing/boringer-avatars/blob/main/packages/lib-solid/src/avatars/avatar-bauhaus.utils.ts
 * and stripped out reactivity + unnecessary parts. All credit belongs to https://boringavatars.com/.
 */
function BoringAvatar(props: AvatarProps) {
	// TODO: More brand like custom colors?
	const colors = ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"];
	const data = generateData(props.name, colors);

	function getRectTransform() {
		return (
			// biome-ignore lint/style/useTemplate: easier parsing
			"translate(" +
			data.wrapperTranslateX +
			" " +
			data.wrapperTranslateY +
			") rotate(" +
			data.wrapperRotate +
			" " +
			SIZE / 2 +
			" " +
			SIZE / 2 +
			") scale(" +
			data.wrapperScale +
			")"
		);
	}

	function getGroupTransform() {
		return (
			// biome-ignore lint/style/useTemplate: easier parsing
			"translate(" +
			data.faceTranslateX +
			" " +
			data.faceTranslateY +
			") rotate(" +
			data.faceRotate +
			" " +
			SIZE / 2 +
			" " +
			SIZE / 2 +
			")"
		);
	}

	function getOpenMouthData() {
		// biome-ignore lint/style/useTemplate: easier parsing
		return "M15 " + (19 + data.mouthSpread) + "c2 1 4 1 6 0";
	}

	function getClosedMouthData() {
		// biome-ignore lint/style/useTemplate: easier parsing
		return "M13," + (19 + data.mouthSpread) + " a1,0.75 0 0,0 10,0";
	}

	return (
		<div class={tw(avatarVariants({ size: props.size }), props.class)}>
			<svg
				fill="none"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox={
					// biome-ignore lint/style/useTemplate: easier parsing
					"0 0 " + SIZE + " " + SIZE
				}
			>
				<title>{props.name}</title>
				<mask id="mask__beam" maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
					<rect fill="#FFFFFF" width={SIZE} height={SIZE} rx={SIZE * 2} />
				</mask>
				<g mask="url(#mask__beam)">
					<rect width={SIZE} height={SIZE} fill={data.backgroundColor} />
					<rect
						x="0"
						y="0"
						width={SIZE}
						height={SIZE}
						transform={getRectTransform()}
						fill={data.wrapperColor}
						rx={data.isCircle ? SIZE : SIZE / 6}
					/>
					<g transform={getGroupTransform()}>
						<Show
							fallback={<path d={getClosedMouthData()} fill={data.faceColor} />}
							when={data.isMouthOpen}
						>
							<path
								fill="none"
								stroke-linecap="round"
								d={getOpenMouthData()}
								stroke={data.faceColor}
							/>
						</Show>
						<rect
							stroke="none"
							x={14 - data.eyeSpread}
							y={14}
							width={1.5}
							height={2}
							rx={1}
							fill={data.faceColor}
						/>
						<rect
							stroke="none"
							x={20 + data.eyeSpread}
							y={14}
							width={1.5}
							height={2}
							rx={1}
							fill={data.faceColor}
						/>
					</g>
				</g>
			</svg>
		</div>
	);
}

export interface Color {
	color: string;
	translateX: number;
	translateY: number;
	rotate: number;
	isSquare: boolean;
}

const SIZE = 36;

const hashCode = (name: string) => {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		const character = name.charCodeAt(i);
		hash = (hash << 5) - hash + character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

const getDigit = (number: number, ntn: number) => {
	return Math.floor((number / 10 ** ntn) % 10);
};

const getBoolean = (number: number, ntn: number) => {
	return !(getDigit(number, ntn) % 2);
};

const getUnit = (number: number, range: number, index?: number) => {
	const value = number % range;

	if (index && getDigit(number, index) % 2 === 0) {
		return -value;
	}
	return value;
};

const getRandomColor = (number: number, colors: string[], range: number) => {
	return colors[number % range] as string;
};

const getContrast = (hexcolor: string) => {
	if (!hexcolor) {
		return "#FFFFFF";
	}

	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === "#") {
		// biome-ignore lint/style/noParameterAssign: easier parsing
		hexcolor = hexcolor.slice(1);
	}

	// Convert to RGB value
	const r = Number.parseInt(hexcolor.substr(0, 2), 16);
	const g = Number.parseInt(hexcolor.substr(2, 2), 16);
	const b = Number.parseInt(hexcolor.substr(4, 2), 16);

	// Get YIQ ratio
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;

	// Check contrast
	return yiq >= 128 ? "#000000" : "#FFFFFF";
};

export function generateData(name: string, colors: string[]) {
	const numFromName = hashCode(name);
	const range = colors?.length;
	const wrapperColor = getRandomColor(numFromName, colors, range);
	const preTranslateX = getUnit(numFromName, 10, 1);
	const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
	const preTranslateY = getUnit(numFromName, 10, 2);
	const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

	const data = {
		wrapperColor: wrapperColor,
		faceColor: getContrast(wrapperColor),
		backgroundColor: getRandomColor(numFromName + 13, colors, range),
		wrapperTranslateX: wrapperTranslateX,
		wrapperTranslateY: wrapperTranslateY,
		wrapperRotate: getUnit(numFromName, 360),
		wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
		isMouthOpen: getBoolean(numFromName, 2),
		isCircle: getBoolean(numFromName, 1),
		eyeSpread: getUnit(numFromName, 5),
		mouthSpread: getUnit(numFromName, 3),
		faceRotate: getUnit(numFromName, 10, 3),
		faceTranslateX:
			wrapperTranslateX > SIZE / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
		faceTranslateY:
			wrapperTranslateY > SIZE / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2),
	};

	return data;
}
