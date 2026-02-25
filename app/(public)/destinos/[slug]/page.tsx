interface DestinoDetalleParams {
  params: Promise<{ slug: string }>
}

export default async function DestinoDetallePage({ params }: DestinoDetalleParams) {
  const { slug } = await params
  return <main>{slug}</main>
}
