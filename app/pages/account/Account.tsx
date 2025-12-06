import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@mui/material";
import { useUserDetails } from "~/hooks/UserHooks";

const Account = () => {
    const userDetails = useUserDetails(window.sessionStorage.getItem('username') || '').data;

    return (
        <div>
            <Typography variant="h5" sx={{ mb: 2 }}>
                User Profile
            </Typography>

            <List>
                <ListItem>
                    <ListItemText primary="Username" secondary={userDetails?.username} />
                </ListItem>
                <Divider />

                <ListItem>
                    <ListItemText primary="First Name" secondary={userDetails?.firstName || "-"} />
                </ListItem>
                <Divider />

                <ListItem>
                    <ListItemText primary="Last Name" secondary={userDetails?.lastName || "-"} />
                </ListItem>
                <Divider />

                <ListItem>
                    <ListItemText primary="Email" secondary={userDetails?.email || "-"} />
                </ListItem>
                <Divider />

                <ListItem>
                    <ListItemText primary="Phone" secondary={userDetails?.phone || "-"} />
                </ListItem>
            </List>
        </div>
    );
}

export default Account;