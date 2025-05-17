
interface CurrentLogoProps {
  logoUrl: string | null;
}

const CurrentLogo = ({ logoUrl }: CurrentLogoProps) => {
  if (!logoUrl) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Logo actuel</h3>
      <div className="border rounded-md p-4 bg-muted/30 flex items-center justify-center">
        <img
          src={logoUrl}
          alt="Logo actuel"
          className="max-h-32 max-w-full"
        />
      </div>
    </div>
  );
};

export default CurrentLogo;
