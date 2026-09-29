/**
 * Prevents ugly line breaks inside "T-Shirt(s)" (browsers break after hyphens).
 * Usage: <NoWrapTee text="Printed T-Shirts" />
 */
export function NoWrapTee({ text }: { text: string }) {
  const parts = text.split(/(T-shirts?|T-Shirts?)/);
  return (
    <>
      {parts.map((p, i) =>
        /^T-shirts?$/i.test(p) ? (
          <span key={i} className="whitespace-nowrap">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
