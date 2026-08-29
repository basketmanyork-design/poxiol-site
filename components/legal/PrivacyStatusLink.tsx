export function PrivacyStatusLink({approved}: {approved: boolean}) {
  return approved
    ? <span>Read our <a href="/privacy-policy/" className="font-semibold underline">Privacy Policy</a>.</span>
    : <span><a href="/privacy-policy/" className="font-semibold underline">Draft privacy notice</a> — pending owner and legal approval.</span>
}
