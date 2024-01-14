import {
  createSignal,
  createUniqueId,
  For,
  Show,
  Suspense,
  type ComponentProps,
} from 'solid-js';
import { Icon, RadioCard, Text, TextField, tw, type SvgIcons } from '@nou/ui';

import { createTranslator } from '~/i18n';

import * as cssStyles from './animal-type.module.css';

interface AnimalTypeSelectProps {
  /** input radio element name attribute for animal type */
  typeName: string;
  /** input radio element `name` attribute for animal gender */
  genderName: string;
}

const AnimalTypeSelect = (props: AnimalTypeSelectProps) => {
  const t = createTranslator('app');
  const animalTypes: Array<{ value: string; label: string; icon: SvgIcons }> = [
    {
      value: 'dog',
      label: t('app.animal-type.dog')!,
      icon: 'dog',
    },
    {
      value: 'cat',
      label: t('app.animal-type.cat')!,
      icon: 'cat',
    },
    {
      value: 'bird',
      label: t('app.animal-type.bird')!,
      icon: 'bird',
    },
    {
      value: 'fish',
      label: t('app.animal-type.fish')!,
      icon: 'fish',
    },
    {
      value: 'rabbit',
      label: t('app.animal-type.rabbit')!,
      icon: 'rabbit',
    },
    {
      value: 'horse',
      label: t('app.animal-type.horse')!,
      icon: 'horse',
    },
    {
      value: 'other',
      label: t('app.animal-type.other')!,
      icon: 'alien',
    },
  ];
  /**
   * NB!
   * I choose to have this signal to control a card in which gender selection is rendering.
   * If multiple fields are rendered with the same name and values within the same form, even with display: none,
   * accessibility is still broken: not able to tab into radio, as only one group becomes "available".
   * The alternative was to have different field names for genders to be stored. But in the end, I decided to go with simpler approach
   * for the consumer (plus, less to render and calculate).
   */
  const [checked, setChecked] = createSignal<number | undefined>();

  let animating: HTMLElement | null;
  return (
    <div class="group/animal-type flex flex-col gap-4">
      <div class={cssStyles.wrapper}>
        <For each={animalTypes}>
          {(item, index) => {
            return (
              <RadioCard
                class={tw('snap-x', cssStyles.card)}
                name={props.typeName}
                value={item.value}
                label={item.label}
                icon={<Icon size="sm" use={item.icon} />}
                checked={index() === checked()}
                onChange={(event) => {
                  setChecked(index());
                  const card = event.currentTarget.closest(
                    `.${cssStyles.card}`,
                  );
                  if (!(card instanceof HTMLElement)) return;
                  animating = card;
                  card.addEventListener('transitionend', () => {
                    if (animating === card) {
                      card.scrollIntoView({
                        inline: 'start',
                        block: 'nearest',
                        behavior: 'smooth',
                      });
                      animating = null;
                    }
                  });
                }}
              >
                <Show when={index() === checked()} fallback={null}>
                  <Suspense>
                    <GenderSwitch name={props.genderName} />
                  </Suspense>
                </Show>
              </RadioCard>
            );
          }}
        </For>
      </div>
      <TextField
        name={props.typeName}
        label={t('app.animal-type-other.label')}
        placeholder={t('app.animal-type-other.placeholder')}
        description={t('app.animal-type-other.placeholder')}
        class="hidden group-has-[input[value=other]:checked]/animal-type:flex"
      />
    </div>
  );
};

const GenderSwitch = (props: { name: AnimalTypeSelectProps['genderName'] }) => {
  const t = createTranslator('app');
  const id = createUniqueId();
  return (
    <fieldset
      class={tw(
        cssStyles.genderSwitch,
        'p-3 -mt-3 opacity-100 overflow-hidden flex flex-col gap-2',
      )}
      aria-labelledby={id}
    >
      <Text with="label" as="label" id={id} class="sr-only">
        {t('app.animal-gender')}
      </Text>
      <div class={cssStyles.genderWrapper}>
        <label class={cssStyles.genderSwitchLabel}>
          <input
            type="radio"
            name={props.name}
            class={cssStyles.genderSwitchInput}
            value="male"
          />
          <Text
            with="label"
            class="inline-block text-ellipsis text-nowrap"
            title={t('app.animal-gender.male')}
          >
            {t('app.animal-gender.male')}
          </Text>
        </label>
        <div class="-ml-1 inline-grid">
          <SvgGender class={cssStyles.genderIcon} aria-hidden />
        </div>
        <label class={cssStyles.genderSwitchLabel}>
          <input
            type="radio"
            name={props.name}
            class={cssStyles.genderSwitchInput}
            value="female"
          />
          <Text
            with="label"
            class="inline-block text-ellipsis text-nowrap"
            title={t('app.animal-gender.female')}
          >
            {t('app.animal-gender.female')}
          </Text>
        </label>
      </div>
    </fieldset>
  );
};

const SvgGender = (props: ComponentProps<'svg'>) => {
  return (
    <svg viewBox="0 0 236 272" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs />
      <circle cx="116" cy="120" r="72" fill="currentColor" opacity="0.2" />
      <circle
        cx="116"
        cy="120"
        r="72"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      />
      <g data-male>
        <line
          x1="166.91"
          y1="69.09"
          x2="228"
          y2="8"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        />
        <polyline
          points="180 8 228 8 228 56"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        />
      </g>
      <g data-female>
        <line
          x1="116"
          y1="192"
          x2="116"
          y2="264"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        />
        <line
          x1="76"
          y1="232"
          x2="156"
          y2="232"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        />
      </g>
    </svg>
  );
};

export { AnimalTypeSelect };
