package admin;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JButton;
import javax.swing.JPasswordField;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.awt.event.ActionEvent;

public class Login {

	private JFrame frame;
	private JTextField username;
	private JPasswordField password;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Login window = new Login();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public Login() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setBounds(100, 100, 450, 300);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		
		JLabel lblNewLabel = new JLabel("Username:");
		lblNewLabel.setBounds(81, 89, 100, 16);
		frame.getContentPane().add(lblNewLabel);
		
		username = new JTextField();
		username.setBounds(212, 84, 130, 26);
		frame.getContentPane().add(username);
		username.setColumns(10);
		
		JLabel lblPassword = new JLabel("Password:");
		lblPassword.setBounds(81, 140, 100, 16);
		frame.getContentPane().add(lblPassword);
		
		JButton loginButton = new JButton("Login");
		loginButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (username.getText().equals("admin") && password.getText().equals("123")) {
					FirstMenu menu = new FirstMenu();
					frame.setVisible(false);
					menu.setVisible(true);
					JOptionPane.showMessageDialog(null, "Login Successful");
					
				}
				else
					JOptionPane.showMessageDialog(null, "User and password do not correspond");
				
			}
		});
		loginButton.setBounds(153, 206, 117, 29);
		frame.getContentPane().add(loginButton);
		
		password = new JPasswordField();
		password.setBounds(212, 135, 130, 26);
		frame.getContentPane().add(password);
	}
	
	
	/**
	 * Executes http request
	 * @param targetURL
	 * @param urlParameters
	 * @param requestType (GET, POST, PUT, DELETE)
	 * @return JSON Response
	 */
	public static String executeRequest(String targetURL, String urlParameters, String requestType)
	  {
	    URL url;
	    HttpURLConnection connection = null;  
	    try {
	      //Create connection
	      url = new URL(targetURL);
	      connection = (HttpURLConnection)url.openConnection();
	      connection.setRequestMethod(requestType);
	      
	      if(!requestType.equals("GET")) {
	    	  connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
	    	  connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	    	  connection.setRequestProperty("Content-Language", "en-US");	
	    	  connection.setUseCaches (false);
	    	  connection.setDoInput(true);
	    	  connection.setDoOutput(true);

	    	  //Send request
	    	  DataOutputStream wr = new DataOutputStream (
	    			  connection.getOutputStream ());
	    	  wr.writeBytes (urlParameters);
	    	  wr.flush ();
	    	  wr.close ();
	      }
	      
	      //Get Response	
	      InputStream is = connection.getInputStream();
	      BufferedReader rd = new BufferedReader(new InputStreamReader(is));
	      String line;
	      StringBuffer response = new StringBuffer(); 
	      while((line = rd.readLine()) != null) {
	        response.append(line);
	        response.append('\r');
	      }
	      rd.close();
	      return response.toString();

	    } catch (Exception e) {

	      e.printStackTrace();
	      return null;

	    } finally {

	      if(connection != null) {
	        connection.disconnect(); 
	      }
	    }
	  }
}
