package admin;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;

import org.json.JSONArray;
import org.json.JSONObject;

import java.nio.file.Files;

import javax.swing.JLabel;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JLayeredPane;
import java.awt.CardLayout;
import javax.swing.JList;
import javax.swing.SwingConstants;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.awt.event.ActionEvent;
import javax.swing.JScrollPane;

public class FirstMenu extends JFrame {

	private JPanel contentPane;
	private JPanel manage;
	private JPanel usersInside;
	private JPanel usersActive;
	private JPanel history;
	private JLayeredPane layeredPane;
	private static DefaultListModel<Building> dlmBuilding = new DefaultListModel<>();
	private static DefaultListModel<String> dlmActiveUsers = new DefaultListModel<>();

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					FirstMenu frame = new FirstMenu();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	public void switchPanel(JPanel panel) {
		layeredPane.removeAll();
		layeredPane.add(panel);
		layeredPane.repaint();
		layeredPane.revalidate();
	}

	/**
	 * Create the frame.
	 */
	public FirstMenu() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 811, 544);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);

		JLabel lblWelcomeToThe = new JLabel("Welcome to the Administrator Interface. Hope you're having a good day!");
		lblWelcomeToThe.setHorizontalAlignment(SwingConstants.CENTER);
		lblWelcomeToThe.setBounds(6, 19, 799, 33);
		contentPane.add(lblWelcomeToThe);

		JLabel lblWhatDoYou = new JLabel("\nWhat do you want to do today?");
		lblWhatDoYou.setHorizontalAlignment(SwingConstants.CENTER);
		lblWhatDoYou.setBounds(6, 60, 799, 16);
		contentPane.add(lblWhatDoYou);

		JButton btnManageBuildings = new JButton("Manage Buildings");
		btnManageBuildings.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				switchPanel(manage);
			}
		});
		btnManageBuildings.setBounds(33, 102, 170, 33);
		contentPane.add(btnManageBuildings);

		JButton btnSeeActiveUsers = new JButton("See active users");
		btnSeeActiveUsers.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				switchPanel(usersActive);
			}
		});
		btnSeeActiveUsers.setBounds(397, 102, 170, 33);
		contentPane.add(btnSeeActiveUsers);

		JButton btnSeeUsersInside = new JButton("See users inside building");
		btnSeeUsersInside.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				switchPanel(usersInside);
			}
		});
		btnSeeUsersInside.setBounds(215, 102, 170, 33);
		contentPane.add(btnSeeUsersInside);

		JButton btnSeeHistory = new JButton("See history");
		btnSeeHistory.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				switchPanel(history);
			}
		});
		btnSeeHistory.setBounds(579, 102, 170, 33);
		contentPane.add(btnSeeHistory);

		layeredPane = new JLayeredPane();
		layeredPane.setBounds(6, 143, 799, 373);
		contentPane.add(layeredPane);
		layeredPane.setLayout(new CardLayout(0, 0));

		JPanel empty = new JPanel();
		layeredPane.add(empty, "name_58755716468941");

		manage = new JPanel();
		layeredPane.add(manage, "name_53064456607961");
		manage.setLayout(null);

		JButton btnCreate = new JButton("Create");
		btnCreate.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				CreateBuilding create = new CreateBuilding();
				create.setVisible(true);
			}
		});
		btnCreate.setBounds(623, 94, 117, 29);
		manage.add(btnCreate);

		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setBounds(29, 25, 574, 327);
		manage.add(scrollPane);

		JList<Building> buildingList = new JList<>();
		scrollPane.setViewportView(buildingList);
		buildingList.setModel(dlmBuilding);
		refreshBuildings();

		JButton btnDelete = new JButton("Delete");
		btnDelete.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				Login.executeRequest(Config.REST_URL + "buildings/" + buildingList.getSelectedValue().getId(), " ", "DELETE");
				refreshBuildings();
			}
		});
		btnDelete.setBounds(623, 135, 117, 29);
		manage.add(btnDelete);


		JButton btnUploadFile = new JButton("Upload File");
		btnUploadFile.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				JFileChooser chooser = new JFileChooser();

				int returnVal = chooser.showOpenDialog(null);
				if(returnVal == JFileChooser.APPROVE_OPTION) {
			        File file = chooser.getSelectedFile();
			        DefaultListModel<Building> newDlmBuildings = readBuildingsFromFile(file);
			        for(int i=0;i<newDlmBuildings.getSize();i++) {

			        	try {
							String urlParameters =
									"building_id=" + URLEncoder.encode(newDlmBuildings.get(i).getId(), "UTF-8") +
									"&name=" + URLEncoder.encode(newDlmBuildings.get(i).getName(), "UTF-8") +
									"&latitude=" + URLEncoder.encode(newDlmBuildings.get(i).getLatitude(), "UTF-8")+
									"&longitude=" + URLEncoder.encode(newDlmBuildings.get(i).getLongitude(), "UTF-8");
							Login.executeRequest(Config.REST_URL + "buildings/" + newDlmBuildings.get(i).getId(), urlParameters, "DELETE");
							Login.executeRequest(Config.REST_URL + "buildings/", urlParameters, "POST");
						} catch (UnsupportedEncodingException e1) {
							// TODO Auto-generated catch block
							e1.printStackTrace();
						}
			        }
			        refreshBuildings();
				}
			}
		});
		btnUploadFile.setBounds(623, 240, 117, 29);
		manage.add(btnUploadFile);

		JButton btnRefresh_1 = new JButton("Refresh");
		btnRefresh_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				refreshBuildings();
			}
		});
		btnRefresh_1.setBounds(623, 22, 117, 29);
		manage.add(btnRefresh_1);

		usersInside = new JPanel();
		layeredPane.add(usersInside, "name_52833081209141");
		usersInside.setLayout(null);

		JScrollPane scrollPane_1 = new JScrollPane();
		scrollPane_1.setBounds(6, 6, 787, 361);
		usersInside.add(scrollPane_1);

		JList list_1 = new JList();
		scrollPane_1.setViewportView(list_1);

		usersActive = new JPanel();
		layeredPane.add(usersActive, "name_135783483257574");
		usersActive.setLayout(null);

		JScrollPane scrollPane_3 = new JScrollPane();
		scrollPane_3.setBounds(50, 15, 500, 340);
		usersActive.add(scrollPane_3);

		JList activeUsersList = new JList();
		scrollPane_3.setViewportView(activeUsersList);
		activeUsersList.setModel(dlmActiveUsers);

		JButton btnRefresh = new JButton("Refresh");
		btnRefresh.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				refreshActiveUsers();
			}
		});
		btnRefresh.setBounds(620, 26, 117, 29);
		usersActive.add(btnRefresh);
		refreshActiveUsers();

		history = new JPanel();
		layeredPane.add(history, "name_53074142847739");




	}

	public static void refreshBuildings() {
		String json = Login.executeRequest(Config.REST_URL + "buildings/", " ", "GET");
		//System.out.println(json);
		JSONObject jsonObject = new JSONObject(json);
		JSONArray buildingsGet = jsonObject.getJSONArray("data");

		dlmBuilding.clear();
		for (int i = 0; i < buildingsGet.length(); i++) {
            String buildingId = buildingsGet.getJSONObject(i).getString("building_id");
            String name = buildingsGet.getJSONObject(i).getString("name");
            String latitude = Float.toString(buildingsGet.getJSONObject(i).getFloat("latitude"));
            String longitude = Float.toString(buildingsGet.getJSONObject(i).getFloat("longitude"));
            //System.out.println(buildingId);
            dlmBuilding.addElement(new Building(buildingId, name, latitude, longitude));
		}
	}

	public static void refreshActiveUsers() {
		String json = Login.executeRequest(Config.REST_URL + "users/Active", " ", "GET");
		System.out.println(json);
		JSONObject jsonObject = new JSONObject(json);
		JSONArray ActiveUsersGet = jsonObject.getJSONArray("data");

		dlmActiveUsers.clear();
		for (int i = 0; i < ActiveUsersGet.length(); i++) {
            String istID = ActiveUsersGet.getJSONObject(i).getString("istID");
            //System.out.println(istID);
            dlmActiveUsers.addElement(istID);
		}
	}

	public static DefaultListModel<Building> readBuildingsFromFile(File f) {
    	try {
    		DefaultListModel<Building> buildings = new DefaultListModel<>();
            byte[] bytes = Files.readAllBytes(f.toPath());
            String jsonString = new String(bytes,"UTF-8");
            JSONArray jsonArray = new JSONArray(jsonString);
            for (int i = 0; i < jsonArray.length(); i++) {
                String buildingId = jsonArray.getJSONObject(i).getString("building_id");
                String name = jsonArray.getJSONObject(i).getString("name");
                String latitude = Float.toString(jsonArray.getJSONObject(i).getFloat("latitude"));
                String longitude = Float.toString(jsonArray.getJSONObject(i).getFloat("longitude"));
                //System.out.println(buildingId);
                buildings.addElement(new Building(buildingId, name, latitude, longitude));
            }
            return buildings;

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
