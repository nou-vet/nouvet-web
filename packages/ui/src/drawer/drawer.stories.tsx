import type { Meta } from 'storybook-solidjs';

import { Button } from '../button';
import { Form } from '../form';
import { TextField } from '../text-field';

import { Drawer } from './drawer';

const meta = {
  title: 'Drawer',
  // @ts-expect-error types mismatch
  component: Drawer.Root,
  argTypes: {},
} satisfies Meta<typeof Drawer>;

export default meta;

export const AnimalShortcut = () => {
  return (
    <>
      <Button popoverTarget="weight" variant="secondary">
        Add pet's weight info
      </Button>
      <Drawer id="weight" aria-labelledby="weight-popup-label">
        <span id="weight-popup-label" class="sr-only">
          Add pet's weight info
        </span>
        <Form
          class="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log('valid!');
            // can be ref, can be #id access
            const popover = e.currentTarget.closest('[popover]');
            if (popover instanceof HTMLElement) {
              popover.hidePopover();
            }
          }}
        >
          <TextField
            label="Weight"
            type="number"
            inputMode="numeric"
            step="0.1"
            name="weight"
          />
          <div class="flex flex-row gap-2 self-end">
            <Button
              variant="ghost"
              popoverTargetAction="hide"
              popoverTarget="weight"
            >
              Later
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
