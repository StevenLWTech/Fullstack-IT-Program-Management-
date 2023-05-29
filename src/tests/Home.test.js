//Work in progress
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import Home from '../components/Home';

// // Test case 1: Test the initial rendering of the component
// // test('renders loading state when data is null', () => {
// //   render(<Home data={null} />);
// //   expect(screen.getByText('Loading...')).toBeInTheDocument();
// // });

// // test('renders "No data available" message when data is empty', () => {
// //   render(<Home data={[]} />);
// //   expect(screen.getByText('No data available.')).toBeInTheDocument();
// // });

// // Test case 2: Test the rendering of dropdown filters
// test('renders dropdown filters based on data columns', () => {
//   const data = [
//     { College: 'Bates Technical College', 'Program Type': 'Associate', 'Program Name': 'Cloud Computing and Networking Technology' },
//     { College: 'Cascadia College', 'Program Type': 'Associate', 'Program Name': 'Network Infrastructure Technology' },
//     // Add more sample data as needed
//   ];
//   render(<Home data={data} />);
  
//   // Verify that dropdowns are rendered
//   expect(screen.getByLabelText('College')).toBeInTheDocument();
//   expect(screen.getByLabelText('Program Type')).toBeInTheDocument();
//   expect(screen.getByLabelText('Program Name')).toBeInTheDocument();
  
//   // Verify the options in the dropdowns
//   const collegeDropdown = screen.getByLabelText('College');
//   expect(collegeDropdown).toHaveDisplayValue(''); // Empty option
//   expect(collegeDropdown).toHaveDisplayValue('Bates Technical College');
//   expect(collegeDropdown).toHaveDisplayValue('Cascadia College');
  
//   // Add similar assertions for other dropdowns
// });

// // Test case 3: Test the behavior of dropdown filters
// test('filters table data based on selected filter values', () => {
//   const data = [
//     { College: 'Bates Technical College', 'Program Type': 'Associate', 'Program Name': 'Cloud Computing and Networking Technology' },
//     { College: 'Cascadia College', 'Program Type': 'Associate', 'Program Name': 'Network Infrastructure Technology' },
//     // Add more sample data as needed
//   ];
//   render(<Home data={data} />);
  
//   // Select filter values
//   const collegeDropdown = screen.getByLabelText('College');
//   fireEvent.change(collegeDropdown, { target: { value: 'Bates Technical College' } });
  
//   // Verify the table data is filtered
//   const table = screen.getByRole('table');
//   expect(table).toHaveTextContent('Bates Technical College');
//   expect(table).not.toHaveTextContent('Cascadia College');
  
//   // Add similar assertions for other filters
// });

// // Test case 4: Test the behavior of the search input
// test('filters table data based on search query', () => {
//   const data = [
//     { College: 'Bates Technical College', 'Program Type': 'Associate', 'Program Name': 'Cloud Computing and Networking Technology' },
//     { College: 'Cascadia College', 'Program Type': 'Associate', 'Program Name': 'Network Infrastructure Technology' },
//     // Add more sample data as needed
//   ];
//   render(<Home data={data} />);
  
//   // Enter search query
//   const searchInput = screen.getByPlaceholderText('Search...');
//   fireEvent.change(searchInput, { target: { value: 'Bates Technical College' } });
  
//   // Verify the table data is filtered
//   const table = screen.getByRole('table');
//   expect(table).toHaveTextContent('Bates Technical College');
//   expect(table).not.toHaveTextContent('Cascadia College');
  
//   // Add similar assertions for different search queries
// });

// // // Test case 5: Test the sorting of table data
// // test('sorts table data based on column', () => {
// //   const data = [
// //     { College: 'Cascadia College', 'Program Type': 'Associate', 'Program Name': 'Network Infrastructure Technology' },
// //     { College: 'Bates Technical College', 'Program Type': 'Associate', 'Program Name': 'Cloud Computing and Networking Technology' },
// //     // Add more sample data as needed
// //   ];
// //   render(<Home data={data} />);
  
// //   // Click on the sort button for a specific column
// //   const sortButton = screen.getByText('Program Type').parentNode.querySelector('.sort-button');
// //   fireEvent.click(sortButton);
  
// //   // Verify the table data is sorted
// //   const table = screen.getByRole('table');
// //   const rows = table.querySelectorAll('tbody tr');
// //   expect(rows[0]).toHaveTextContent('Bates Technical College');
// //   expect(rows[1]).toHaveTextContent('Cascadia College');
  
// //   // Add similar assertions for other columns and sorting directions
// // });
