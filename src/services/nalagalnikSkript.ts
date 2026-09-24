export async function naloziSkript(url: string) {
  const dobljeno = await fetch(url);
  return await dobljeno.text();
}
