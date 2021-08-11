const delay = {
    flash: 10,
    fast: 100,
    normal:300,
    slow:500,
}

const userOk = {
    first_name: 'Jôé',
    last_name: "Fo'-No",
    email: `dev+cypress.${Math.random().toFixed(7)}@unkle.fr`,
    wireless_phone_number: '+33600000000',
    housing_search_step:'1',
    rent_amount:1000,
    rental_profile: 'alone',
    worker_profile: 'private_worker',
    employment_profile: 'full_time',
    salary: 2500,
    lead_source: 'social_network',
    password: '00000000',
    password_confirm: '00000000',
};

const userBad = {
    first_name: '111',
    last_name: "111",
    email: `-`,
    wireless_phone_number: '+3360000000',
    housing_search_step:'1',
    rent_amount:-1,
    rental_profile: 'alone',
    worker_profile: 'private_worker',
    employment_profile: 'full_time',
    salary: -1,
    lead_source: 'social_network',
    password: '0',
    password_confirm: '0',
};

const steps = ['name', 'contact', 'residence', 'rent', 'work', 'incomes', 'roommates', 'other-info'];

let currentStep = 0;

const submitBtnClick = () => {
    cy.wait(200)
    cy.get('form button[type=submit]').click();
};

const prevBtnClick = () => {
    cy.wait(200)
    cy.get('form button[type]').first().click();
};

const completeStep = isDynamic => cy.get('form [name]').each(([element],i,arr) => {
    if(!element.required && !userOk[element.name]) {
        return;
    } else if(element.type === 'radio'){
        if(element.value === userOk[element.name]) {
            cy.get(element).check({force: true})
        }
    } else if (element.tagName === 'SELECT'){
        cy.get(element).select(userOk[element.name])
    } else {
        setInput(element);
    };

    if(isDynamic && i === (arr.length-1)){
        completeStep();
    }
});

const setInput = (element) => {
    cy.get(element).type(userBad[element.name], {delay:delay.normal});
    cy.wait(10)
    cy.get('form .error').should('have.length',1);
    cy.wait(10);
    cy.get(element).clear();
    cy.get(element).type(userOk[element.name], {delay:delay.normal});
    cy.get('form .error').should('have.length',0);
}

describe('Test all onboarding renter on stage', function() {
    it('Onboarding renter', function() {

        cy.visit('https://stage.unkle.io/application/new/renter/');

        //Escape cookie banner
        cy.get('.cookie-banner button').click();

        cy.url().should('includes', steps[currentStep]);
        completeStep();
        submitBtnClick();
        currentStep++;

        prevBtnClick();
        submitBtnClick();

        cy.url().should('includes', steps[currentStep]);
        completeStep();
        submitBtnClick();
        currentStep++;

        cy.url().should('includes', steps[currentStep]);
        completeStep();
        submitBtnClick();
        currentStep++;

        prevBtnClick();
        submitBtnClick();

        cy.url().should('includes', steps[currentStep]);
        completeStep();
        submitBtnClick();
        currentStep++;

        cy.url().should('includes', steps[currentStep]);
        completeStep(true);
        submitBtnClick();
        currentStep++;

        cy.url().should('includes', steps[currentStep]);
        completeStep();
        submitBtnClick();
        currentStep++;

        cy.url().should('includes', steps[currentStep+1]);
        completeStep();
        submitBtnClick();

        cy.url().should('includes', 'dashboard');
    })
})