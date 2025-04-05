# BTContract

## System Flow
<div align="center">
<sub>Figure 0X - BPMN Diagram</sub>
<img src="assets/system_flow.jpg" width="100%">
<sup>Source: Material produced by the authors (2025)</sup>
</div>
This application allows users to create, manage, and deploy Bitcoin-based contracts without needing to know Bitcoin script coding. Similar to platforms like OpenZeppelin, it abstracts the complexity of smart contract creation on the Bitcoin layer, making it accessible to non-technical users.

---
### 1. Account Creation & Authentication
<div align="center">
<sub>Figure 0X - BPMN Diagram - Part 1</sub>
<img src="assets/system_flow_p1.png" width="100%">
<sup>Source: Material produced by the authors (2025)</sup>
</div>

- Users start by accessing the main page
- They click on "Getting Started"
- If they don't have an account:
  - Click "Create an Account"
  - Register by providing name, email, password, and public key
- If they already have an account:
  - Click "Login"
  - Fill in email and password fields
- After authentication, users are directed to the main view page
---

### 2. Main Navigation Decision
<div align="center">
<sub>Figure 0X - BPMN Diagram - Part 2</sub>
<img src="assets/system_flow_p2.png" width="100%">
<sup>Source: Material produced by the authors (2025)</sup>
</div>

After login, users can choose between two main paths:
- Visualize existing contracts
- Create new contracts

---


### 3. Visualizing Existing Contracts
<div align="center">
<sub>Figure 0X - BPMN Diagram - Part 3</sub>
<img src="assets/system_flow_p3.png" width="100%">
<sup>Source: Material produced by the authors (2025)</sup>
</div>

To view existing contracts:
- Click on "Visualize my contracts"
- Select a contract from those already created
- View detailed information about the contract and signature of addressee
---



### 4. Creating New Contracts

<div align="center">
<sub>Figure 0X - BPMN Diagram - Part 4</sub>
<img src="assets/system_flow_p4.png" width="100%">
<sup>Source: Material produced by the authors (2025)</sup>
</div>

To create a new contract:
- Click on "Create new Contract"
- Choose the type of contract needed:
- Fill in all required fields for the selected contract type
- Click "generate contract" to create the contract

### 5. Contract Deployment

<div align="center">
<sub>Figure 0X - BPMN Diagram - Part 5</sub>
<img src="assets/system_flow_p5.png" width="100%">
<sup>Source: Material produced by the authors (2025)</sup>
</div>

After generating the contract:
- System checks if user has a premium plan
- If Yes:
  - User can select "Generate Juridical Contract" for enhanced legal features
- If No (or after juridical contract generation):
  - User confirms contract details
  - Clicks "Deploy" to send the contract via email to the recipient

## Key Features
- Simplified contract creation without Bitcoin scripting knowledge
- Two contract types (Sale and Loan) with customizable parameters
- Premium option for juridical contract generation
- Contract visualization tools
- Automated deployment and recipient notification