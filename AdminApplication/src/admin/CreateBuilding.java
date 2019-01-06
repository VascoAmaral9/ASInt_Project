package admin;

import java.awt.BorderLayout;
import java.awt.FlowLayout;

import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.SwingConstants;
import javax.swing.JTextField;
import java.awt.event.ActionListener;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.awt.event.ActionEvent;

public class CreateBuilding extends JDialog {

	private final JPanel contentPanel = new JPanel();
	private JTextField id;
	private JTextField name;
	private JTextField lat;
	private JTextField lon;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		try {
			CreateBuilding dialog = new CreateBuilding();
			dialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
			dialog.setVisible(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Create the dialog.
	 */
	public CreateBuilding() {
		setBounds(100, 100, 450, 300);
		getContentPane().setLayout(new BorderLayout());
		contentPanel.setBorder(new EmptyBorder(5, 5, 5, 5));
		getContentPane().add(contentPanel, BorderLayout.CENTER);
		contentPanel.setLayout(null);
		{
			JLabel lblId = new JLabel("ID:");
			lblId.setHorizontalAlignment(SwingConstants.TRAILING);
			lblId.setBounds(48, 50, 121, 16);
			contentPanel.add(lblId);
		}
		{
			JLabel lblNewLabel = new JLabel("Name:");
			lblNewLabel.setHorizontalAlignment(SwingConstants.TRAILING);
			lblNewLabel.setBounds(48, 90, 121, 16);
			contentPanel.add(lblNewLabel);
		}
		{
			JLabel lblLatitude = new JLabel("Latitude:");
			lblLatitude.setHorizontalAlignment(SwingConstants.TRAILING);
			lblLatitude.setBounds(48, 130, 121, 16);
			contentPanel.add(lblLatitude);
		}
		{
			JLabel lblLongitude = new JLabel("Longitude:");
			lblLongitude.setHorizontalAlignment(SwingConstants.TRAILING);
			lblLongitude.setBounds(48, 170, 121, 16);
			contentPanel.add(lblLongitude);
		}
		{
			id = new JTextField();
			id.setBounds(194, 45, 130, 26);
			contentPanel.add(id);
			id.setColumns(10);
		}
		{
			name = new JTextField();
			name.setBounds(194, 85, 130, 26);
			contentPanel.add(name);
			name.setColumns(10);
		}
		{
			lat = new JTextField();
			lat.setBounds(194, 125, 130, 26);
			contentPanel.add(lat);
			lat.setColumns(10);
		}
		{
			lon = new JTextField();
			lon.setBounds(194, 165, 130, 26);
			contentPanel.add(lon);
			lon.setColumns(10);
		}
		{
			JPanel buttonPane = new JPanel();
			buttonPane.setLayout(new FlowLayout(FlowLayout.RIGHT));
			getContentPane().add(buttonPane, BorderLayout.SOUTH);
			{
				JButton okButton = new JButton("OK");
				okButton.addActionListener(new ActionListener() {
					public void actionPerformed(ActionEvent e) {
						try {
							String urlParameters =
									"building_id=" + URLEncoder.encode(id.getText(), "UTF-8") +
									"&name=" + URLEncoder.encode(name.getText(), "UTF-8") +
									"&latitude=" + URLEncoder.encode(lat.getText(), "UTF-8")+
									"&longitude=" + URLEncoder.encode(lon.getText(), "UTF-8");
							Login.executeRequest(Config.REST_URL + "buildings/" + id.getText(), urlParameters, "DELETE");
							Login.executeRequest(Config.REST_URL + "buildings/", urlParameters, "POST");
							//JSON parse status "success" dialog box
						} catch (UnsupportedEncodingException e1) {
							// TODO Auto-generated catch block
							e1.printStackTrace();
						}
						FirstMenu.refreshBuildings();
						dispose();
					}
				});
				okButton.setActionCommand("OK");
				buttonPane.add(okButton);
				getRootPane().setDefaultButton(okButton);
			}
			{
				JButton cancelButton = new JButton("Cancel");
				cancelButton.addActionListener(new ActionListener() {
					public void actionPerformed(ActionEvent e) {
						dispose();
					}
				});
				cancelButton.setActionCommand("Cancel");
				buttonPane.add(cancelButton);
			}
		}
	}

}
