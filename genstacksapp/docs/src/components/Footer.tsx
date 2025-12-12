export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="flex justify-center py-4">
        <p className="text-center text-sm md:text-base text-foreground/60 tracking-wider">
          © {new Date().getFullYear()} Genstacks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
