
class Organization {
    constructor(name, account, website, fuelReimbursementPolicy, speedLimitPolicy, parentOrganizationId = null) {
      this.name = name;
      this.account = account;
      this.website = website;
      this.fuelReimbursementPolicy = fuelReimbursementPolicy;
      this.speedLimitPolicy = speedLimitPolicy;
      this.parentOrganizationId = parentOrganizationId;
      this.childOrganizations = [];
    }
  
    addChildOrganization(childOrganization) {
      this.childOrganizations.push(childOrganization);
    }
  }
  
  module.exports = Organization;