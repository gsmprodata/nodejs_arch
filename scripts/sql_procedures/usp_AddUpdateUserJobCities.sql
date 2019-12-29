-- CALL  usp_AddUpdateUserJobCities('asd', '{1, 4, 2}', null)
-- DROP Procedure usp_AddUpdateUserJobCities
CREATE OR REPLACE PROCEDURE public.usp_AddUpdateUserJobCities(
	IN param_userId text,
	IN param_cityIds integer[] DEFAULT null,
	INOUT isChanged bool DEFAULT null,
	INOUT errorMsg text DEFAULT null,
	INOUT succesMsg text DEFAULT null
)
LANGUAGE 'plpgsql'
AS $BODY$ 
	DECLARE 
		cityIdToUpdate integer[];
		cityIdToAdd integer[];
		cityIdToDelete integer[];
	BEGIN
	    isChanged := false;
		errorMsg := '';
		succesMsg := '';
		
	    cityIdToUpdate := (SELECT array_agg(cityId) FROM user_job_cities WHERE userId = param_userId 
						   AND isActive = false AND cityId IN (SELECT unnest(param_cityIds)));
						   
		cityIdToDelete := (SELECT array_agg(cityId) FROM user_job_cities WHERE userId = param_userId 
						   AND isActive = true AND cityId NOT IN (SELECT unnest(param_cityIds)));
		cityIdToAdd := (SELECT array_agg(unnest) FROM  unnest(param_cityIds) where unnest not in 
						( SELECT cityId from user_job_cities WHERE userId = param_userId));
						
		--DELETE The cities that are not in the list
		IF array_length(cityIdToDelete,1) is not null AND  array_length(cityIdToDelete, 1) > 0
		THEN
			UPDATE user_job_cities
			SET isActive = false WHERE cityId in (SELECT unnest(cityIdToDelete));
			isChanged := true;
			succesMsg := succesMsg || '\n userJobCity deleted cityIds' || cityIdToDelete :: text;
		END IF;
		--UPDATE The cities that are in the list
		IF array_length(cityIdToUpdate,1) is not null AND  array_length(cityIdToUpdate, 1) > 0
		THEN
			UPDATE user_job_cities
			SET isActive = true WHERE cityId in (SELECT unnest(cityIdToUpdate));
			isChanged := true;
			succesMsg := succesMsg || '\n userJobCity updated cityIds' || cityIdToUpdate :: text;
		END IF;
		--ADD new User Job Cities
		IF array_length(cityIdToAdd,1) is not null AND  array_length(cityIdToAdd, 1) > 0
		THEN
			INSERT INTO user_job_cities (userId, cityId, isActive, createdAt, updatedAt)
			SELECT param_userId, unnest, true ,NOW(), NOW() FROM UNNEST(cityIdToAdd);
			isChanged := true;
			succesMsg := succesMsg || '\n userJobCity added cityIds' || cityIdToAdd :: text;
		END IF;
		COMMIT;
		
		IF isChanged = false 
		THEN
			errorMsg := 'No changes detected';
		END IF;
		RETURN;
	END;
$BODY$;