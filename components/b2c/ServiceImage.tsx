import { B2CImage } from "@/components/b2c/B2CImage";
import { Photo } from "@/components/Photo";

/**
 * The image at the top of a Shared Shuttle / Private Transfer card, in
 * one place so /transfers and the results page cannot drift apart.
 *
 * Shared: a close crop of the minibus from the supplied airport image
 * (illustrative). Private: SWT Elite's own Vito photograph.
 */
export function ServiceImage({ id, sizes }: { id: "shared" | "private"; sizes: string }) {
  if (id === "shared") {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal">
        <B2CImage name="shuttle-minibus-airport" sizes={sizes} />
      </div>
    );
  }
  return (
    <Photo
      src="/images/operations/transportation-airport-vito.png"
      alt="A private SWT Elite van with its driver outside an airport terminal"
      aspect="16 / 9"
      position="50% 60%"
      sizes={sizes}
    />
  );
}
