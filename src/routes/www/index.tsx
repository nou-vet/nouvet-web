import { Title } from '@solidjs/meta';
import ArrowCircleUpRight from '~/assets/icons/arrow-circle-up-right.svg';
import { createTranslator } from '~/i18n';
import { ButtonLink } from '~/lib/ui/button';

import { Icon } from '~/lib/ui/icon';

export default function WWW() {
  const t = createTranslator('www');

  return (
    <>
      <Title>{t('common.meta.title')}</Title>
      <section class="flex flex-col items-center justify-between gap-12 @container/hero md:flex-row">
        <div class="flex flex-col gap-12">
          <div class="flex flex-col gap-6">
            <h1
              class="text-5xl font-bold leading-[1.1] md:text-6xl"
              innerHTML={t('www.headline')}
            />
            <h2 class="text-2xl">{t('www.subheadline')}</h2>
          </div>
          <ButtonLink
            href="/family"
            size="cta"
            class="flex items-center gap-4 self-start text-lg"
          >
            {t('www.cta-start')}
            <Icon icon={ArrowCircleUpRight} class="h-8 w-8 shrink-0" />
          </ButtonLink>
        </div>
        <div class="border-foreground -z-10 -mt-32 w-full max-w-[500px] self-end overflow-hidden rounded-full border object-cover p-8 md:z-auto md:w-[50%] md:min-w-[320px]">
          <img
            src="https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            class="aspect-[9/12] w-full rounded-full bg-primary/5 object-cover"
            alt={t('www.hero-image')}
          />
        </div>
      </section>
      <section aria-labelledby="features">
        <h2 class="sr-only" id="features">
          {t('www.heading-features')}
        </h2>
        {/* <ul class="spacing-bleed flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-2">
					<li>
						<Card class="w-64 snap-start border-2 border-background bg-gradient-to-br from-primary/5 via-secondary/5 via-60% to-primary/5 shadow-sm">
							<CardHeader>
								<CardTitle>{t("www.feature-medical-history")}</CardTitle>
							</CardHeader>
						</Card>
					</li>
					<li>
						<Card class="w-64 snap-start border-2 border-background bg-gradient-to-br from-primary/5 via-secondary/5 via-50% to-primary/5 shadow-sm">
							<CardHeader>
								<CardTitle>{t("www.feature-share-reminders")}</CardTitle>
							</CardHeader>
						</Card>
					</li>
					<li>
						<Card class="w-64 snap-start border-2 border-background bg-gradient-to-br from-primary/5 via-secondary/5 via-50% to-primary/5 shadow-sm">
							<CardHeader>
								<CardTitle>{t("www.feature-connect-veterinaries")}</CardTitle>
							</CardHeader>
						</Card>
					</li>
				</ul> */}
      </section>
    </>
  );
}
