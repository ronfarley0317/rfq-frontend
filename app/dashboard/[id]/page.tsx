export default async function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log('Viewing ID:', id);

  return (
    <div>
      <h1>Quote Details: {id}</h1>
    </div>
  );
}