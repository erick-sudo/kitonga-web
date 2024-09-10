export function Footer() {
  return (
    <div className="px-2 border-t py-2 text-gray-500 text-sm flex">
      <div className="py-1 px-2">
        <span>Kitonga&nbsp;</span>
        <span>Copyright &copy;</span>
        <span>{new Date().getFullYear()}</span>
      </div>
      <div className="border-l flex-grow border-t"></div>
    </div>
  );
}
