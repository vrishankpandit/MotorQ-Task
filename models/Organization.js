class OrganizationManager {
    constructor() {
      this.organizations = [];
    }
  
    // Function to create a new organization
    createOrganization(data) {
      const newOrganization = {
        id: this.organizations.length + 1, // Simple auto-increment ID
        name: data.name,
        account: data.account,
        website: data.website,
        fuelReimbursementPolicy: data.fuelReimbursementPolicy,
        speedLimitPolicy: data.speedLimitPolicy,
        parentOrganizationId: data.parentOrganizationId || null,
        childOrganizations: data.childOrganizations || []
      };
      this.organizations.push(newOrganization);
      return newOrganization;
    }
  
    // Function to find an organization by ID
    findOrganizationById(id) {
      return this.organizations.find(org => org.id === id);
    }
  
    // Function to get all organizations
    getAllOrganizations() {
      return this.organizations;
    }
  }

  // Export the class
module.exports = OrganizationManager;