
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface UserTableProps {
  profiles: Profile[];
  onViewDetails: (profile: Profile) => void;
  onEditUser: (profile: Profile) => void;
}

const UserTable = ({ profiles, onViewDetails, onEditUser }: UserTableProps) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 hover:bg-red-600';
      case 'manager': return 'bg-blue-500 hover:bg-blue-600';
      case 'cashier': return 'bg-green-500 hover:bg-green-600';
      case 'salesperson': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Niveau d'accès</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id} className="hover:cursor-pointer" onClick={() => onViewDetails(profile)}>
              <TableCell className="font-medium">{profile.full_name || "Non défini"}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(profile.role)}>
                  {profile.role === 'admin' && 'Administrateur'}
                  {profile.role === 'manager' && 'Manager'}
                  {profile.role === 'cashier' && 'Caissier'}
                  {profile.role === 'salesperson' && 'Vendeur'}
                  {profile.role === 'user' && 'Utilisateur'}
                </Badge>
              </TableCell>
              <TableCell>{profile.access_level}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditUser(profile);
                  }}
                >
                  Modifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
