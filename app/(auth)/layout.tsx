import LayoutApp from "@/components/layouts/LayoutApp"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LayoutApp>{children}</LayoutApp>
}
