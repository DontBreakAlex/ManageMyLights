export default function(v: string): string {
	const value = Deno.env.get(v)
	if (!value)
		throw new Error(`${v} env variable is not defined`);
	return value
}
