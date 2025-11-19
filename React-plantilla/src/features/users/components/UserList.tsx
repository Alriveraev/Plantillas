import type { UserDetail } from "@/api/types";
import { UserCard } from "./UserCard";

interface UserListProps {
  users: UserDetail[];
  onEdit: (user: UserDetail) => void;
  onDelete: (user: UserDetail) => void;
}

export const UserList = ({ users, onEdit, onDelete }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
