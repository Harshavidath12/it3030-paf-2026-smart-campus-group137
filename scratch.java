import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class scratch {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/smartcampus?prepareThreshold=0";
        String user = "postgres.pkspykytswumrkjevbrg";
        String pass = "StudentNo4200abc";
        
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            // Try checking for ENUM type
            try {
                stmt.execute("ALTER TYPE ticket_status ADD VALUE IF NOT EXISTS 'CLOSED'");
                stmt.execute("ALTER TYPE ticket_status ADD VALUE IF NOT EXISTS 'REJECTED'");
                System.out.println("Modified ENUM ticket_status successfully.");
            } catch (Exception e) {
                System.out.println("Failed to modify ENUM: " + e.getMessage());
            }

            // Try removing Check Constraint if it exists
            try {
                stmt.execute("ALTER TABLE tickets DROP CONSTRAINT tickets_status_check");
                System.out.println("Dropped check constraint tickets_status_check.");
            } catch (Exception e) {
                System.out.println("Failed to drop constraint: " + e.getMessage());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
