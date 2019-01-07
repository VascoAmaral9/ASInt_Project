package admin;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;

import org.json.JSONArray;
import org.json.JSONObject;

import java.nio.file.Files;

import javax.swing.JLabel;
import javax.swing.ButtonGroup;
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
import javax.swing.event.ListSelectionListener;
import javax.swing.event.ListSelectionEvent;
import javax.swing.JRadioButton;
import java.awt.event.ItemListener;
import java.awt.event.ItemEvent;

public class FirstMenu extends JFrame {

	private JPanel contentPane;
	private JPanel manage;
	private JPanel usersInside;
	private JPanel usersActive;
	private JPanel history;
	private JLayeredPane layeredPane;
	private static DefaultListModel<Building> dlmBuilding = new DefaultListModel<>();
	private static DefaultListModel<String> dlmActiveUsers = new DefaultListModel<>();
	private static DefaultListModel<String> dlmUsersInside = new DefaultListModel<>();
	private static DefaultListModel<Movements> dlmMovements = new DefaultListModel<>();
	private static DefaultListModel<Messages> dlmMessages = new DefaultListModel<>();
	private static DefaultListModel<Object> dlmEmpty = new DefaultListModel<>();
	private static JRadioButton rdbtnUser;
	private static JRadioButton rdbtnBuilding;
	private static JRadioButton rdbtnAll;
	private static JList list_1;
	private static JList<Building> list_2;
	private static JList list_3;
	private static JList activeUsersList;
	private static JList<Building> buildingList;
	private JScrollPane scrollPane_5;
	private JLabel empty = new JLabel();
	

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
		layeredPane.setBounds(6, 135, 799, 385);
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
		btnCreate.setBounds(623, 77, 117, 29);
		manage.add(btnCreate);

		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setBounds(20, 25, 583, 339);
		manage.add(scrollPane);
		
		buildingList = new JList<>();
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
		
		JButton btnEdit = new JButton("Edit");
		btnEdit.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				EditBuilding edit = new EditBuilding(buildingList.getSelectedValue());
				edit.setVisible(true);
			}
		});
		btnEdit.setBounds(623, 106, 117, 29);
		manage.add(btnEdit);

		usersInside = new JPanel();
		layeredPane.add(usersInside, "name_52833081209141");
		usersInside.setLayout(null);

		JScrollPane scrollPane_1 = new JScrollPane();
		scrollPane_1.setBounds(20, 34, 474, 334);
		usersInside.add(scrollPane_1);

		JList b_list = new JList();
		scrollPane_1.setViewportView(b_list);
		b_list.setModel(dlmBuilding);
		b_list.addListSelectionListener(new ListSelectionListener() {
			public void valueChanged(ListSelectionEvent e) {
				getUsersInside((Building) b_list.getSelectedValue());
			}
		});
		
		JScrollPane scrollPane_2 = new JScrollPane();
		scrollPane_2.setBounds(506, 34, 272, 334);
		usersInside.add(scrollPane_2);
		
		JList u_list = new JList();
		scrollPane_2.setViewportView(u_list);
		u_list.setModel(dlmUsersInside);
		
		JLabel lblUsers = new JLabel("Users Inside:");
		lblUsers.setHorizontalAlignment(SwingConstants.CENTER);
		lblUsers.setBounds(594, 6, 101, 16);
		usersInside.add(lblUsers);
		
		JLabel lblChooseBuilding = new JLabel("Choose Building:");
		lblChooseBuilding.setHorizontalAlignment(SwingConstants.CENTER);
		lblChooseBuilding.setBounds(187, 6, 113, 16);
		usersInside.add(lblChooseBuilding);

		usersActive = new JPanel();
		layeredPane.add(usersActive, "name_135783483257574");
		usersActive.setLayout(null);

		JScrollPane scrollPane_3 = new JScrollPane();
		scrollPane_3.setBounds(50, 15, 500, 340);
		usersActive.add(scrollPane_3);

		activeUsersList = new JList();
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
		history.setLayout(null);
		
		
		
		JLabel lblSearchBy = new JLabel("Search by:");
		lblSearchBy.setBounds(348, 5, 71, 16);
		history.add(lblSearchBy);
		
		JScrollPane scrollPane_4 = new JScrollPane();
		scrollPane_4.setBounds(288, 65, 491, 132);
		history.add(scrollPane_4);
		
		JList list = new JList();
		scrollPane_4.setViewportView(list);
		list.setModel(dlmMovements);
		
		scrollPane_5 = new JScrollPane();
		scrollPane_5.setBounds(29, 65, 247, 302);
		history.add(scrollPane_5);
		
		list_1 = new JList();
		list_1.setModel(dlmActiveUsers);
		list_1.addListSelectionListener(new ListSelectionListener() {
			public void valueChanged(ListSelectionEvent e) {
				if(!list_1.isSelectionEmpty())
				getLogs(1);
			}
		});
		
		
		list_2 = new JList<>();
		list_2.setModel(dlmBuilding);
		list_2.addListSelectionListener(new ListSelectionListener() {
			public void valueChanged(ListSelectionEvent e) {
				if(!list_2.isSelectionEmpty())
				getLogs(2);
			}
		});
		
		list_3 = new JList<>();
		dlmEmpty.clear();
		list_3.setModel(dlmEmpty);
		
		
		rdbtnUser = new JRadioButton("User");
		rdbtnUser.addItemListener(new ItemListener() {
			public void itemStateChanged(ItemEvent e) {
				changedRadioButton();
			}
		});
		rdbtnUser.setBounds(358, 21, 61, 23);
		history.add(rdbtnUser);
		
		rdbtnBuilding = new JRadioButton("Building");
		rdbtnBuilding.addItemListener(new ItemListener() {
			public void itemStateChanged(ItemEvent e) {
				changedRadioButton();
			}
		});
		rdbtnBuilding.setBounds(262, 21, 96, 23);
		history.add(rdbtnBuilding);
		
		rdbtnAll = new JRadioButton("All");
		rdbtnAll.addItemListener(new ItemListener() {
			public void itemStateChanged(ItemEvent e) {
				changedRadioButton();
			}
		});
		rdbtnAll.setSelected(true);
		rdbtnAll.setBounds(431, 21, 61, 23);
		history.add(rdbtnAll);
		
		ButtonGroup bg = new ButtonGroup();
		bg.add(rdbtnUser);
		bg.add(rdbtnBuilding);
		bg.add(rdbtnAll);
		
		JLabel lblMovements = new JLabel("Movements:");
		lblMovements.setBounds(495, 45, 83, 16);
		history.add(lblMovements);
		
		JScrollPane scrollPane_6 = new JScrollPane();
		scrollPane_6.setBounds(288, 221, 491, 146);
		history.add(scrollPane_6);
		
		JList list_4 = new JList();
		scrollPane_6.setViewportView(list_4);
		list_4.setModel(dlmMessages);
		
		JLabel lblMessages = new JLabel("Messages:");
		lblMessages.setBounds(500, 198, 83, 16);
		history.add(lblMessages);
	}
	
	public void changedRadioButton() {
		if(rdbtnUser.isSelected()) {
			refreshActiveUsers();
			scrollPane_5.setViewportView(list_1);
			list_1.setSelectedIndex(0);
			getLogs(1);
		} else if (rdbtnBuilding.isSelected()) {
			refreshBuildings();
			scrollPane_5.setViewportView(list_2);
			list_2.setSelectedIndex(0);
			getLogs(2);
		} else if (rdbtnAll.isSelected()) {
			scrollPane_5.setViewportView(list_3);
			getLogs(3);
		}
	}
	
	
	public void getLogs(int a) {
		String URL;
		switch (a) {
			case 1: URL= "users/logs/?istID=" + list_1.getSelectedValue(); break;
			case 2: URL= "users/logs/?building_id=" + list_2.getSelectedValue().getId(); break;
			case 3: URL= "users/logs"; break;
			default: URL= " "; break;
		}
		
		String json = Login.executeRequest(Config.REST_URL + URL, " ", "GET");
		System.out.println(json);
		JSONObject jsonObject = new JSONObject(json);
		JSONArray movementsGet = jsonObject.getJSONArray("movements");
		JSONArray messagesGet = jsonObject.getJSONArray("messages");

		dlmMovements.clear();
		for (int i = 0; i < movementsGet.length(); i++) {
            String istID = movementsGet.getJSONObject(i).getString("istID");
            String buildingA = movementsGet.getJSONObject(i).getString("buildingA");
            String buildingB = movementsGet.getJSONObject(i).getString("buildingB");
            String dateTime = movementsGet.getJSONObject(i).getString("createdAt");
            
            Movements mov = new Movements(istID, buildingA, buildingB, dateTime);
            
            //System.out.println(istID);
            dlmMovements.addElement(mov);
		}
		
		dlmMessages.clear();
		for (int i = 0; i < messagesGet.length(); i++) {
            String sender_id = messagesGet.getJSONObject(i).getString("sender_id");
            String receiver_id = messagesGet.getJSONObject(i).getString("receiver_id");
            String dateTime = messagesGet.getJSONObject(i).getString("createdAt");
            String message = messagesGet.getJSONObject(i).getString("text");
            String type = messagesGet.getJSONObject(i).getString("type");
            
            Messages mes = new Messages(sender_id, receiver_id, dateTime, message, type);
            
            //System.out.println(istID);
            dlmMessages.addElement(mes);
		}
	}
	
	
	public static void getUsersInside(Building building) {
		String json = Login.executeRequest(Config.REST_URL + "users/Active/?building_id=" + building.getId(), " ", "GET");
		//System.out.println(json);
		JSONObject jsonObject = new JSONObject(json);
		JSONArray UsersInsideGet = jsonObject.getJSONArray("data");

		dlmUsersInside.clear();
		for (int i = 0; i < UsersInsideGet.length(); i++) {
            String istID = UsersInsideGet.getJSONObject(i).getString("istID");
            //System.out.println(istID);
            dlmUsersInside.addElement(istID);
		}
	}

	public static void refreshBuildings() {
		String json = Login.executeRequest(Config.REST_URL + "buildings/", " ", "GET");
		System.out.println(json);
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
		//System.out.println(json);
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
