export async function naloziSkript(url) {
  const dobljeno = await fetch(url);
  return await dobljeno.text();
}
