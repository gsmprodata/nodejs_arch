-- PROCEDURE: public.usp_addupdateuserskills(text, integer[], boolean, text, text)

-- DROP PROCEDURE public.usp_addupdateuserskills(text, integer[], boolean, text, text);

CREATE OR REPLACE PROCEDURE public.usp_addupdateuserskills(
	param_userid text,
	param_skills integer[] DEFAULT NULL::integer[],
	INOUT ischanged boolean DEFAULT NULL::boolean,
	INOUT errormsg text DEFAULT NULL::text,
	INOUT succesmsg text DEFAULT NULL::text)
LANGUAGE 'plpgsql'

AS $BODY$ 
	DECLARE 
		skillsToUpdate integer[];
		skillsToAdd integer[];
		skillsToDelete integer[];
	BEGIN
	    isChanged := false;
		errorMsg := '';
		succesMsg := '';
		
	    skillsToUpdate := (SELECT array_agg(skillId) FROM user_skills WHERE userId = param_userId 
						   AND isActive = false AND skillId IN (SELECT unnest(param_skills)));
						   
		skillsToDelete := (SELECT array_agg(skillId) FROM user_skills WHERE userId = param_userId 
						   AND isActive = true AND skillId NOT IN (SELECT unnest(param_skills)));
						   
		skillsToAdd := (SELECT array_agg(unnest) FROM  unnest(param_skills) where unnest not in 
						( SELECT skillId from user_skills WHERE userId = param_userId));
						
		--DELETE The cities that are not in the list
		IF array_length(skillsToDelete,1) is not null AND  array_length(skillsToDelete, 1) > 0
		THEN
			UPDATE user_skills
			SET isActive = false WHERE skillId in (SELECT unnest(skillsToDelete));
			isChanged := true;
			succesMsg := succesMsg || '\n userSkills deleted skillIds' || skillsToDelete :: text;
		END IF;
		--UPDATE The cities that are in the list
		IF array_length(skillsToUpdate, 1) is not null AND  array_length(skillsToUpdate, 1) > 0
		THEN
			UPDATE user_skills
			SET isActive = true WHERE skillId in (SELECT unnest(skillsToUpdate));
			isChanged := true;
			succesMsg := succesMsg || '\n user_skills updated skills' || skillsToUpdate :: text;
		END IF;
		--ADD new User Job Cities
		IF array_length(skillsToAdd,1) is not null AND  array_length(skillsToAdd, 1) > 0
		THEN
			INSERT INTO user_skills (userId, skillId, isActive, createdAt, updatedAt)
			SELECT param_userId, unnest, true ,NOW(), NOW() FROM UNNEST(skillsToAdd);
			isChanged := true;
			succesMsg := succesMsg || '\n user_skills added skillId' || skillsToAdd :: text;
		END IF;
		COMMIT;
		
		IF isChanged = false 
		THEN
			errorMsg := 'No changes detected';
		END IF;
		RETURN;
	END;
$BODY$;
