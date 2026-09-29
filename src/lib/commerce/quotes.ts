/**
 * BULK QUOTE REQUESTS (mock).
 * Production: POST to a route handler / server action that validates again,
 * stores the lead (CRM, email, Google Sheet...) and uploads the design file
 * to storage. Never trust client-side validation alone.
 */
export interface BulkQuoteRequest {
  name: string;
  organization: string;
  email: string;
  phone: string;
  quantity: number;
  tshirtType: string;
  sizes: string;
  colors: string;
  deadline: string;
  message: string;
  designFileName: string | null;
}

export async function submitBulkQuote(req: BulkQuoteRequest): Promise<{ ok: true; reference: string }> {
  void req;
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true, reference: `BQ-${Date.now().toString(36).toUpperCase().slice(-6)}` };
}
