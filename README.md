# CRUD API

## Postman

- **Import the JSON File into Postman**

  1. Open Postman.
  2. Click the "Import" button, which is usually at the top left corner of the Postman interface.
  3. In the import window, you have a few options to import your collection. You can:

  - Drag and drop the postman.json file into the provided area.
  - Click "Upload Files", navigate to where you saved your postman.json file, select it, and click "Open".

  4. Once the file is uploaded, Postman will display the contents of the collection to be imported. Ensure everything looks correct, then click "Import".

- **Review the Imported Collection**

  1. After importing, you will see the "CRUD" collection in the Collections sidebar on the left-hand side of the Postman interface. Click on it to expand and view the requests contained within the collection.
  2. The collection uses variables such as {{url}} and {{userId}}.
     `userId` as id (change it to created one)
     `url` as http://localhost:4000

- **Use the Collection**

Now that you have imported the collection and set up your environment, you can start using the requests. Select an environment with your variables set, and you can begin sending requests like "Get All Users", "Get User By ID", etc., directly from Postman.
