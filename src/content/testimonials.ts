/**
 * Verified patient reviews only (e.g. copied verbatim from the clinic's
 * Google Business profile with the reviewer's public name).
 *
 * While this list is empty the testimonials section is hidden in production.
 * In development it renders clearly-marked placeholder blocks so the layout
 * can be reviewed — those placeholders are never shipped.
 */

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  procedureAr?: string;
  /** Where the review was published, e.g. "Google". */
  source: string;
};

export const testimonials: readonly Testimonial[] = [];
